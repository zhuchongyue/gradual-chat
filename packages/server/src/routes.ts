import { SwaggerRouter } from 'koa-swagger-decorator';

import { user } from './controller';

const router = new SwaggerRouter();

router.get("/users", user.getUsers);

router.swagger({
  title: 'Chat-Server-Api',
  description: 'API for Chat Server',
  version: '1.0.0'
})

export { router }