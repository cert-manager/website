package main

import (
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/namsral/flag"
)

var (
	smtpHost             string
	smtpPort             int
	smtpUsername         string
	smtpPassword         string
	contactDestAddress   string
	contactSenderAddress string
)

func main() {
	flag.StringVar(&smtpHost, "smtp-host", "email-smtp.eu-west-1.amazonaws.com", "SMTP hostname")
	flag.IntVar(&smtpPort, "smtp-port", 587, "SMTP port")
	flag.StringVar(&smtpUsername, "smtp-username", "", "SMTP username")
	flag.StringVar(&smtpPassword, "smtp-password", "", "SMTP password")
	flag.StringVar(&contactSenderAddress, "contact-sender-address", "website@jetstack.net", "Contact forumlar sender address")
	flag.StringVar(&contactDestAddress, "contact-dest-address", "christian+website@jetstack.io", "Contact forumlar dest address")
	flag.Parse()

	r := gin.Default()

	// mount hugo site
	r.Use(static.Serve("/", static.LocalFile("./", true)))

	// provide contact form
	apiRouterGroup := r.Group("/api/v1")
	apiRouterGroup.POST("/contact", handleContact)

	blogGroup := r.Group("/blog")
	blogGroup.GET("/", handleRedirect(301, "https://blog.jetstack.io"))

	r.Run() // listen and serve on 0.0.0.0:8080
}
