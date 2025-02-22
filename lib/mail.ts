import { plans } from "./plan";

const { sendMail } = useNodeMailer();

export async function sendTransactionMail(transaction: any, emailTo: string) {
  const msg = `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Details</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: #4CAF50;
            color: #ffffff;
            text-align: center;
            padding: 15px;
            font-size: 20px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333;
        }
        .transaction-details {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Transaction Confirmation
        </div>
        <div class="content">
            <p>Dear <strong>${transaction.user.fullname}</strong>,</p>
            <p>We are pleased to inform you that your transaction has been successfully processed. Below are the details:</p>
            
            <div class="transaction-details">
                <p><strong>Transaction ID:</strong> ${
                  transaction.transactionId
                }</p>
                <p><strong>Amount:</strong> ${transaction.amount} USD</p>
                <p><strong>Date:</strong> ${new Date(transaction.createdAt)}</p>
                <p><strong>Payment Method:</strong> ${transaction.channel}</p>
                <p><strong>Type:</strong> ${transaction.type}</p>
                <p><strong>Transaction Status:</strong> ${
                  transaction.status
                }</p>
            </div>

            <p>If you have any questions, please feel free to contact our support team.</p>

            <p>Best regards,<br>
            <strong>Financial Growth</strong></p>
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} Financial Growth. All rights reserved.
        </div>
    </div>
</body>
</html>

    `;

  return await sendMail({
    subject: `Transaction Completed`,
    text: msg,
    html: msg,
    to: emailTo,
  });
}

export async function sendInvestmentMail(investment: any, emailTo: string) {
  const plan = plans.find(
    (p) => p.value === investment.plan
  ) as (typeof plans)[0];
  const msg = `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Details</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: #4CAF50;
            color: #ffffff;
            text-align: center;
            padding: 15px;
            font-size: 20px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333;
        }
        .transaction-details {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Transaction Confirmation
        </div>
        <div class="content">
            <p>Dear <strong>${investment.user.fullname}</strong>,</p>
            <p>We are pleased to inform you that your investment has been activated. Below are the details:</p>
            
            <div class="transaction-details">
                <p><strong>Investment ID:</strong> ${
                  investment.investmentId
                }</p>
                <p><strong>Amount:</strong> ${investment.amount} USD</p>
                <p><strong>Date:</strong> ${new Date(investment.start_date)}</p>
                <p><strong>Returns on Investment:</strong> ${
                  (plan.roi / 100) * investment.amount
                } USD</p>
                <p><strong>Returns Cycle:</strong> every ${
                  plan.duration
                } hours</p>
                <p><strong>Status:</strong> ${investment.status}</p>
            </div>

            <p>If you have any questions, please feel free to contact our support team.</p>

            <p>Best regards,<br>
            <strong>Financial Growth</strong></p>
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} Financial Growth. All rights reserved.
        </div>
    </div>
</body>
</html>

    `;

  await sendMail({
    subject: `Investment Confirmed`,
    text: msg,
    html: msg,
    to: emailTo,
  });
}

export async function sendWithdrawalRequestMail(
   
  transaction: any,
  emailTo: string
) {
    
  const msg = `
   <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Withdrawal Request Received</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: #4CAF50;
            color: #ffffff;
            text-align: center;
            padding: 15px;
            font-size: 20px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333;
        }
        .details-box {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Withdrawal Request Received
        </div>
        <div class="content">
            <p>Dear <strong>${transaction.user.fullname}</strong>,</p>
            <p>We have received your withdrawal request and are currently processing it. Please find the details below:</p>
            
            <div class="details-box">
                <p><strong>Amount:</strong> ${transaction.amount} USD</p>
                <p><strong>Date:</strong> ${new Date(transaction.createdAt)}</p>
                <p><strong>Transaction ID:</strong> ${
                  transaction.transactionId
                }</p>
                <p><strong>Status:</strong> Processing</p>
            </div>

            <p>Our team is working on your request, and we appreciate your patience. The processing time may vary based on your payment method.</p>

            <p>If you have any questions, please contact our support team.</p>

            <p>Best regards,<br>
            <strong>Financial Growth</strong></p>
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} Financial Growth. All rights reserved.
        </div>
    </div>
</body>
</html>

    `;

  return await sendMail({
    subject: `Withdrawal Request Processing`,
    text: msg,
    html: msg,
    to: [emailTo, 'chibykomk@gmail.com'],
  });
}

export async function sendInvestmentRequestMail(
   
    investment: any,
    emailTo: string
  ) {
      
    const msg = `
     <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Withdrawal Request Received</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
          }
          .container {
              max-width: 600px;
              background: #ffffff;
              padding: 20px;
              margin: auto;
              border-radius: 8px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              background: #4CAF50;
              color: #ffffff;
              text-align: center;
              padding: 15px;
              font-size: 20px;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
          }
          .content {
              padding: 20px;
              font-size: 16px;
              color: #333;
          }
          .details-box {
              background: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
          }
          .footer {
              text-align: center;
              padding: 15px;
              font-size: 14px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              Investment Request Received & Processing
          </div>
          <div class="content">
              <p>Dear <strong>${investment.user.fullname}</strong>,</p>
              <p>We have received your investment request and are currently processing it. Please find the details below:</p>
              
              <div class="details-box">
                  <p><strong>Amount:</strong> ${investment.amount} USD</p>
                  <p><strong>Date:</strong> ${new Date(investment.createdAt)}</p>
                  <p><strong>Investment ID:</strong> ${
                    investment.investmentId
                  }</p>
                  <p><strong>Status:</strong> Processing</p>
              </div>
  
              <p>Our team is working on your request, and we appreciate your patience. The processing time may vary based on your payment channel.</p>
  
              <p>If you have any questions, please contact our support team.</p>
  
              <p>Best regards,<br>
              <strong>Financial Growth</strong></p>
          </div>
          <div class="footer">
              &copy; ${new Date().getFullYear()} Financial Growth. All rights reserved.
          </div>
      </div>
  </body>
  </html>
  
      `;
  
    return await sendMail({
      subject: `Investment Request Processing`,
      text: msg,
      html: msg,
      to: [emailTo, 'chibykomk@gmail.com'],
    });
  }

export async function sendMsgRecievedMail(user: any) {
  const msg = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Message Received</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center">
                <table width="600px" cellspacing="0" cellpadding="20" style="background: #f8f8f8; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center">
                            <h2 style="color: #0073e6;">Thank You for Reaching Out!</h2>
                            <p>We have received your message and will get back to you as soon as possible.</p>
                            <p>If your inquiry is urgent, feel free to reach out directly at service@financial-growth.com.</p>
                            <p>We appreciate your patience and look forward to assisting you.</p>
                            <br>
                            <p>Best regards,<br>
                            <strong>Financial Growth</strong></p>
                            <hr style="border: 0; border-top: 1px solid #ddd;">
                            <p style="font-size: 12px; color: #777;">This is an automated confirmation. No reply is necessary.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

    `;

  await sendMail({
    subject: `Message Recieved`,
    text: msg,
    html: msg,
    to: [user.email, 'chibykomk@gmail.com']
  });
}

export async function sendMsgReplyMail(message: any, reply: string) {
  const msg = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Message Received</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
              <td align="center">
                  <table width="600px" cellspacing="0" cellpadding="20" style="background: #f8f8f8; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                      <tr>
                          <td align="center">
                              <h2 style="color: #0073e6;">Thank You for Reaching Out!</h2>
                              <p><strong>${reply}</strong></p>
                            
                              
                              <br>
                              <p>We appreciate your patience and look forward to assisting you.</p>
                              <br>
                              <p>Best regards,<br>
                              <strong>Financial Growth</strong></p>
                              <hr style="border: 0; border-top: 1px solid #ddd;">
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>
  
      `;

  await sendMail({
    subject: `RE: ${message.subject}`,
    text: msg,
    html: msg,
    to: message.user.email,
  });
}
