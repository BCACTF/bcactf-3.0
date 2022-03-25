import fastify from 'fastify';
const app = fastify({ logger: true });

app.get("/", async (request, reply) => {
    return "Hello, world!";
});

try {
    await app.listen(3000);
} catch (err) {
    app.log.error(err);
    process.exit(1);
}