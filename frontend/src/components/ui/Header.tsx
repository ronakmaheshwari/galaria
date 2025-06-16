import { ShareButton } from "./Share";


export default function ContentHeader({ title }: { title: string }) {
    return(
        <div className="w-full h-10 flex justify-between items-center p-3">
            <h2 className="text-xl font-medium">{title}</h2>
            <ShareButton />
        </div>
    )
}