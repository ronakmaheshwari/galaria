import express from "express"
import { userMiddleware } from "../middleware"
import z from 'zod'
import prisma from "../lib/prisma/prisma"
import RandomlinkGenerator from "../utils"
import dotenv from "dotenv"
import { Resend } from "resend";

dotenv.config();

const shareRouter = express.Router()
const Shareschema = z.object({
    share:z.boolean()
}) 
const resend = new Resend(process.env.Resend_Key);

shareRouter.post('/',userMiddleware,async(req:any,res:any)=>{
    try {
        const share = Shareschema.safeParse(req.body);
        if(!share.success){
            return res.status(400).json({
                message:"Invalid Inputs were provided",
                error:share.error.flatten()
            })
        }
        if(share){
        const userId = req.userId;
        const ExistingHash = await prisma.link.findUnique({
            where:{
                userId:userId
            }
        })
        if(ExistingHash){
            return res.status(200).json({
                link:ExistingHash.hash
            })
        }
        const hash = RandomlinkGenerator(6);
        if (typeof hash !== "string") {
            return res.status(500).json({ error: "Failed to generate a valid hash" });
        }
        const newHash = await prisma.link.create({
            data:{
                userId:userId,
                hash:hash
            }
        })
        return res.status(200).json({
                link:newHash.hash
        })
        }else{
            await prisma.link.delete({
                where:{
                    userId:req.userId
                }
            })
            return res.status(200).json({
                message:"Deleted Shared Link"
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Sharing Feature Failed" })
    }
})

shareRouter.get('/email', userMiddleware, async (req: any, res: any) => {
  const userId = req.userId;
  const filter = req.query.filter as string || "";

  try {
    const response = await prisma.user.findMany({
      where: {
        id: {
          not: userId
        },
        ...(filter && {
          email: {
            contains: filter,
            mode: 'insensitive' 
          }
        })
      },
      select: {
        id: true,
        email: true
      }
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const HTMLTemplate = (email: string, link: string) => `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #4CAF50;">📸 Hey ${email}!</h2>
      <p style="font-size: 16px; line-height: 1.6;">
        Your friend just shared some amazing photos with you on <strong>Galaria</strong>!
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        Click the button below to view the photo collection they’ve handpicked just for you.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://galaria.10xdevs.me/share/${link}" style="background-color: #4CAF50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          View Photos
        </a>
      </div>
      <p style="font-size: 14px; color: #888;">
        If you have trouble opening the link, copy and paste the following URL in your browser:<br/>
        <a href="https://galaria.10xdevs.me/share/${link}">https://galaria.10xdevs.me/share/${link}</a>
      </p>
      <hr style="margin-top: 30px;" />
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        Sent with ❤️ via Galaria
      </p>
    </div>
  </div>
`;

shareRouter.post('/email', userMiddleware, async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const { shared } = req.body;

    let link = await prisma.link.findUnique({
      where: {
        userId: userId
      },
      select: {
        hash: true
      }
    });

    if (!link) {
      const hash = RandomlinkGenerator(6);
      if (typeof hash !== "string") {
        return res.status(500).json({ error: "Failed to generate a valid hash" });
      }
      const newLink = await prisma.link.create({
        data: {
          userId: userId,
          hash: hash
        }
      });
      link = newLink;
    }

    const CheckShared = await prisma.user.findUnique({
      where: {
        id: shared
      }
    });

    if (!CheckShared) {
      return res.status(404).json({
        message: "User you're trying to share with doesn't exist"
      });
    }

    const html = HTMLTemplate(CheckShared.email, link.hash);

    await resend.emails.send({
      from: "onboarding@hire.10xdevs.me",
      to: CheckShared.email,
      subject: "You've Got Photos!",
      html
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

shareRouter.get('/:shareLink',userMiddleware,async(req:any,res:any)=>{
    try {
        const hash  = req.params.shareLink
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page-1)*limit

        const response = await prisma.link.findFirst({
            where:{
                hash:hash
            }
        })
        if(!response){
            return res.status(404).json({
                message:"Invalid Link Provided"
            })
        }
        const content = await prisma.content.findMany({
            where:{
                userId:response.userId
            },
            skip,
            take:limit
        })

        const total = await prisma.content.count({
            where:{
                userId:response.userId
            }
        })

        const totalPages = Math.ceil(total/limit);
        const userDetails = await prisma.user.findFirst({
            where:{
                id:response.userId
            },
            select:{
                username:true,email:true,password:false,id:false
            }
        })
        return res.status(200).json({
            message:"Returned Successfully",
            page,
            limit,
            total,
            totalPages,
            userDetails,
            content
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Sharing Feature Failed" })
    }
})





export default shareRouter