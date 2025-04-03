
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host : process.env.SMTP_HOST,
    port : process.env.SMTP_PORT,
    secure : true,
    auth : {
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASS
    }

})

export const sendOTP = async(mail, otp, nombre) =>{
    const html = `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your identity</title>
    </head>
    <body style="margin: 0;padding: 0; background-color: rgba(241, 241, 245, 0.851); font-family:Verdana, Geneva, Tahoma, sans-serif; text-align: center;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td align="center">
                    <table role="presentation" width="600" cellspacing="5" cellpadding="5" border="0" style="background-color: white; border-radius: 10px;padding: 10px; margin-top: 100px;">
                        <tr>
                            <td align="left">
                                <h2>!Hi, ${nombre}!</h2>
                            </td>                    
                        </tr>
                        <tr>
                            <td align="left">
                                <p style="font-size: 16px; color: #333;"> Use this one time password to verify your identity</p>                        
                            </td>                
                        </tr>
                        <tr>
                            <td align="center">
                                <p  style="text-align:center;  ; display: inline-block; padding: 12px 24px; background-color:rgb(245, 245, 245);; color:black; text-decoration: none; font-weight: bold; border-radius: 5px; letter-spacing: 3px;">
                                    ${otp}                                       
                                </p>
                            </td>
                        </tr>
                    </table>                  
                </td>
            </tr>
        </table>
        <br>
        <br>
    </body>
    </html>
    `
    try{
        const res = await transporter.sendMail({
            from : 'PATH FINDER <noti@pathfinder.com',
            to : mail,
            subject : 'Verify your identity',
            html : html,            
        })
        
        return res
            ?  true
            : false

    }catch(error){        
        console.log(error)
        return false
    }

}