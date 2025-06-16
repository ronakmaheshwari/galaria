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
