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



}
