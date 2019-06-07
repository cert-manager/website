package main

import (
	"github.com/gin-gonic/gin"
)

func handleRedirect(code int, dest string) func(*gin.Context) {
	return func(c *gin.Context) {
		c.Redirect(code, dest)
	}
}
