FROM --platform=linux/amd64 node:16
WORKDIR /usr/src/app

# Install puppeteer dependencies
RUN apt-get update -y \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /usr/src/app

# Copy rest of files
COPY public public
RUN chmod -R 777 /usr/src/app/public
RUN npm run build:client:ts
COPY tailwind.config.cjs .
RUN npm run build:client:css

COPY server server
RUN chmod -R 777 /usr/src/app/server
RUN npm run build:server

COPY . .

# Expose port and run server
EXPOSE 3000
CMD ["npm", "start"]