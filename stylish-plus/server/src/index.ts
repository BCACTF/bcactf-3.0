import fastify from 'fastify';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fastifyStatic from 'fastify-static';
const app = fastify({ logger: true });

app.register(fastifyStatic, {
    root: join(dirname(fileURLToPath(import.meta.url)), "../../public"),
});

try {
    await app.listen(3000);
} catch (err) {
    app.log.error(err);
    process.exit(1);
}