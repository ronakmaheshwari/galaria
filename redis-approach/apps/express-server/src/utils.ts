export default function RandomlinkGenerator(length:number) {
    try{
        let randomString = ""
        let link = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789"
        for(let i: number = 0; i <= length; i++){
            randomString+= link.charAt(Math.floor(Math.random()*link.length));
        }
        return randomString
    }catch(e){
        console.error("Error at link generation")
    }
}


export function OTPgenerator(length:number){
    try {
        let randomInt = "";
        const opt = "123456789";
        for(let i=0;i<=length;i++){
            randomInt+= opt.charAt(Math.floor(Math.random()*opt.length));
        }
        return randomInt;
    } catch (error) {
        console.error("Error occured at OtpGeneration")
    }
}