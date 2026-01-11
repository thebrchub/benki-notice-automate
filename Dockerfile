# ================================
# Build stage
# ================================
FROM golang:1.25.5-alpine3.23 AS builder

WORKDIR /ca-app

# Install git (needed for go modules)
RUN apk add --no-cache git

# Copy only go mod files first (cache-friendly)
COPY ./go.mod ./go.sum ./

# Download dependencies (cached if unchanged)
RUN go mod download

# Copy full backend source
COPY ./ .

# Build optimized static binary
RUN CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o app

# ================================
# Runtime stage
# ================================
FROM gcr.io/distroless/base-debian12

WORKDIR /ca-app

# Copy binary only
COPY --from=builder /ca-app/app /ca-app/app

# Railway injects PORT
EXPOSE 2028

# Run
CMD ["/ca-app/app"]

