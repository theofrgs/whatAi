import { CreateUserDTO } from '@src/user/dto/create-user.dto';

export const getUsersSeed = (env: any): CreateUserDTO[] => {
  const users: CreateUserDTO[] = [
    {
      email: env.ADMIN_NAME,
      password: env.ADMIN_PASSWORD,
      firstName: 'administrator',
      lastName: 'administrator',
    },
  ];

  for (let i = 0; i < 30; i++) {
    users.push({
      email: `what-ai-test-mail${i}@example.com`,
      firstName: `what-ai-test-firstname${i}`,
      lastName: `what-ai-test-lastname${i}`,
      password: `what-ai-fake-${i}`,
    });
  }

  return users;
};
