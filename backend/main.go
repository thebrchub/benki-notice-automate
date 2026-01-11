package main

import (
	"compress/gzip"
	"fmt"
	"io"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strconv"
	"strings"
)

var DOMAIN string = os.Getenv("APP_DOMAIN")

func main() {

	if DOMAIN == "" {
		DOMAIN = "https://benkinotice-api.brchub.me"
	}

	// Point to the root domain, not a specific path
	target, _ := url.Parse("https://itat.gov.in")

	proxy := httputil.NewSingleHostReverseProxy(target)

	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.Host = target.Host
		req.URL.Path = strings.TrimPrefix(req.URL.Path, "/itat")

		// Only for captcha, set headers and forward cookies manually
		if strings.HasPrefix(req.URL.Path, "/captcha") {
			req.Header.Set("Referer", "https://itat.gov.in/judicial/tribunalorders/itat")
			req.Header.Set("Origin", "https://itat.gov.in")
			req.Header.Set("Host", "itat.gov.in")

			// Forward all cookies from browser
			if cookieHeader := req.Header.Get("Cookie"); cookieHeader != "" {
				req.Header.Set("Cookie", cookieHeader)
			}
		}
	}

	proxy.ModifyResponse = func(resp *http.Response) error {
		//  Rewrite redirects
		if loc := resp.Header.Get("Location"); loc != "" {
			if after, ok := strings.CutPrefix(loc, "https://itat.gov.in"); ok {
				resp.Header.Set(
					"Location",
					"/itat"+after,
				)
			}
			if after, ok := strings.CutPrefix(loc, "//itat.gov.in"); ok { // protocol-relative
				resp.Header.Set(
					"Location",
					"/itat"+after,
				)
			}
		}

		// Only process HTML
		ct := resp.Header.Get("Content-Type")
		fmt.Println("content type : " + ct)
		if !strings.Contains(ct, "text/html") {
			return nil
		}

		path := strings.ToLower(resp.Request.URL.Path)
		if strings.Contains(path, "captcha") {
			return nil
		}

		var body []byte
		var err error

		//  Handle gzip-compressed responses
		isGzip := resp.Header.Get("Content-Encoding") == "gzip"
		if isGzip {
			gz, err := gzip.NewReader(resp.Body)
			if err != nil {
				return err
			}
			body, err = io.ReadAll(gz)
			gz.Close()
			resp.Body.Close()
			if err != nil {
				return err
			}
		} else {
			body, err = io.ReadAll(resp.Body)
			resp.Body.Close()
			if err != nil {
				return err
			}
		}

		html := string(body)

		//  Rewrite absolute and protocol-relative URLs
		html = strings.ReplaceAll(html, "https://itat.gov.in", DOMAIN+"/itat")
		after, _ := strings.CutPrefix(DOMAIN, "https:")
		html = strings.ReplaceAll(html, "//itat.gov.in", after+"/itat")

		//  Put modified HTML back into response
		var newBody io.ReadCloser
		if isGzip {
			var buf strings.Builder
			gz := gzip.NewWriter(&buf)
			_, err := gz.Write([]byte(html))
			if err != nil {
				return err
			}
			gz.Close()
			newBody = io.NopCloser(strings.NewReader(buf.String()))
		} else {
			newBody = io.NopCloser(strings.NewReader(html))
		}

		resp.Body = newBody
		resp.ContentLength = int64(len(html))
		resp.Header.Set("Content-Length", strconv.Itoa(len(html)))
		resp.Header.Del("X-Frame-Options")
		resp.Header.Del("Content-Security-Policy")

		return nil
	}

	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "2028"
	}

	fmt.Println("Benki Notice Server Started")

	http.Handle("/api/proxy", proxy)
	http.ListenAndServe("0.0.0.0:"+port, nil)
}
