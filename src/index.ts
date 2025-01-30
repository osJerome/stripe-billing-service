import { app } from "./app";
import { config } from "./config/config";

app.listen(config.port, () => {
  console.log(`Server is running on ${process.env.BASE_URL}`);
});
