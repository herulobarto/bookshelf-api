const Hapi = require("@hapi/hapi");
const routes = require("./routes");

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // @ts-ignore
  server.route(routes);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();