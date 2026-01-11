# ================================
# Build stage
# ================================
FROM golang:1.25.5-alpine3.23 AS builder

WORKDIR /notice-app

# Install git (needed for go modules)
RUN apk add --no-cache git

# Copy only go mod files first (cache-friendly)
COPY backend/go.mod ./

# Download dependencies (cached if unchanged)
RUN go mod download

# Copy full backend source
COPY backend/ .

# Build optimized static binary
RUN CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o app

# ================================
# Runtime stage
# ================================
FROM gcr.io/distroless/base-debian12

WORKDIR /notice-app

# Copy binary only
COPY --from=builder /notice-app/app /notice-app/app

# Railway injects PORT
EXPOSE 2028

# Run
CMD ["/notice-app/app"]

