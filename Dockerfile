# =============================================
# Dockerfile — Concesionario Backend
# =============================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Instalar Maven
RUN apk add --no-cache maven

# Build sin tests para imagen de producción
RUN mvn clean package -DskipTests

# ---- Imagen final slim ----
FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="concesionario@dev.com"
LABEL version="1.0.0"
LABEL description="Sistema de Concesionario de Vehículos"

WORKDIR /app

# Copiar JAR construido
COPY --from=builder /app/target/*.jar app.jar

# Crear directorio de logs
RUN mkdir -p /var/log/concesionario

# Usuario no-root por seguridad
RUN addgroup -S concesionario && adduser -S concesionario -G concesionario
USER concesionario

# Puerto de la aplicación
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -q -O- http://localhost:8080/api/actuator/health || exit 1

# Variables de entorno por defecto (sobreescribir en producción)
ENV SPRING_PROFILE=prod \
    SERVER_PORT=8080 \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseContainerSupport"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
