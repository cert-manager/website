package main

import (
	"fmt"
	"net/http"
	"net/smtp"
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
)

type contactForm struct {
	Name       string `form:"name"`
	Title      string `form:"title"`
	Company    string `form:"company"`
	Email      string `form:"email" binding:"required"`
	Phone      string `form:"phone"`
	Message    string `form:"message"`
	Contact    string `form:"contact"`
	Newsletter string `form:"newsletter"`
}

func sendMail(form *contactForm) error {
	content := []string{
		"Subject: Website enquiry",
		"",
	}

	v := reflect.Indirect(reflect.ValueOf(form))
	for i := 0; i < v.NumField(); i++ {
		name := v.Type().Field(i).Name
		value := v.Field(i)
		content = append(content, fmt.Sprintf("%s: %s", name, value))
	}

	auth := smtp.PlainAuth(
		"",
		smtpUsername,
		smtpPassword,
		smtpHost,
	)
	err := smtp.SendMail(
		fmt.Sprintf("%s:%d", smtpHost, smtpPort),
		auth,
		contactSenderAddress,
		strings.Split(contactDestAddress, ","),
		[]byte(strings.Join(content, "\r\n")),
	)
	return err
}

func handleContact(c *gin.Context) {
	var contactForm contactForm
	if err := c.Bind(&contactForm); err != nil {
		c.Error(err)
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err})
		return
	}
	if err := sendMail(&contactForm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		c.Error(err)
		return
	}
	c.Status(http.StatusNoContent)
}
