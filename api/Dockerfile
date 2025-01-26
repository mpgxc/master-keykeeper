FROM oven/bun:1.1.5

WORKDIR /app

COPY package.json .
COPY prisma prisma
COPY src src

RUN bun install
RUN bunx prisma generate

CMD ["bun", "run", "src/index.ts"]