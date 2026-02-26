package com.chatapp.mainchatapp.service;


import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendRegistrationMail(String toEmail,String userName){

        SimpleMailMessage message = new SimpleMailMessage();
         message.setTo(toEmail);
         message.setSubject("Welcome to TALKATIVE\nA Group Chat App to discuss your own topic with your people.");
         message.setText(
                "Hi " + userName + ",\n\n" +
                        "Your registration was successful.\n\n" +
                        "Please verify your email from your profile section.\n\n" +
                        "Thank you for joining ChatApp!"
         );

         mailSender.send(message);

    }


    public void sendLoginMail(String toEmail, String userName){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome Back " + userName);
        message.setText("We noticed a login to your account " + userName +
                "\nIf this was you you\n\nYou can ignore this message. There's no need to worry." +
                "\nIf this wasn't you\n\nComplete the steps to change password now to protect your account"
        );

        mailSender.send(message);

    }


    public void sendPasswordResetOtpMail(String email, String otp) {

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setTo(email);
        mailMessage.setSubject("Password Reset OTP");
        mailMessage.setText(
                "Your OTP for password reset is " + otp +
                        "\n\nThis OTP will expire in 5 minutes."
        );

        mailSender.send(mailMessage);

    }
}
