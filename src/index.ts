import Fastify, { FastifyRequest } from 'fastify';
import { prismaClient } from './lib/prismaClient';

const app = Fastify();

type CreateUserBody = {
  name: string;
  email: string;
};

app.post(
  '/users',
  async (request: FastifyRequest<{ Body: CreateUserBody }>, reply) => {
    const { email, name } = request.body;

    const user = await prismaClient.user.create({
      data: {
        email,
        name,
      },
      select: {
        id: true,
      },
    });

    reply.send({ user });
  }
);

app.post(
  '/users/batch',
  async (
    request: FastifyRequest<{ Body: { users: CreateUserBody[] } }>,
    reply
  ) => {
    const { users } = request.body;

    //Cadastra apenas um item.
    // const createUsers = await prismaClient.user.createMany({
    //   data: users,
    //   skipDuplicates: true,
    // });

    //Cadastra varios itens.
    const createUsers = await prismaClient.user.createManyAndReturn({
      data: users,
      skipDuplicates: true,
      select: {
        id: true,
      },
    });

    reply.send({ createUsers });
  }
);

app.get('/users', async (request, reply) => {
  const users = await prismaClient.user.findMany({
    orderBy: {
      email: {
        sort: 'asc',
        nulls: 'first',
      },
    },
  });

  reply.send({ users });
});

app.get(
  '/users/:id',
  async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const { id } = request.params;

    //Tras o primeiro item que faz sentindo com o where, caso não exista retorna null.
    const users = await prismaClient.user.findFirst({
      where: {
        id,
      },
    });

    //Tras o primeiro item que faz sentindo com o where, caso não exista retorna um error.
    // const users = await prismaClient.user.findFirstOrThrow({
    //   where: {
    //     id,
    //   },
    // });

    //Busca igual os outros, tem perfomace melhor com os index.
    // const users = await prismaClient.user.findUnique({
    //   where: {
    //     id,
    //   },
    // });

    //Busca igual os outros, tem perfomace melhor com os index. Se não encontrar retorna um error.
    // const users = await prismaClient.user.findUniqueOrThrow({
    //   where: {
    //     id,
    //   },
    // });

    reply.send({ users });
  }
);

app.get('/users/stats', async (request, reply) => {
  const {
    _avg: { age: averageAge },
    _count: { email: totalEmails, _all: totalUsers },
    _max: { age: oldestPerson },
    _min: { age: youngestPerson },
  } = await prismaClient.user.aggregate({
    _count: { email: true, _all: true },
    _max: { age: true },
    _min: { age: true },
    _avg: { age: true },
  });

  reply.send({
    stats: {
      totalUsers,
      averageAge,
      totalEmails,
      oldestPerson,
      youngestPerson,
    },
  });
});

type UpdateUserBody = {
  name?: string;
  email?: string;
  age?: number;
  isActive?: boolean;
};

app.put(
  '/users/:id',
  async (
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserBody }>,
    reply
  ) => {
    const { id } = request.params;
    const { age, email, isActive, name } = request.body;

    const user = await prismaClient.user.update({
      where: {
        id,
      },
      data: { age, email, isActive, name },
      select: {
        id: true,
      },
    });

    // const user = await prismaClient.user.updateMany({
    //   where: {
    //     email: {
    //       not: null,
    //     },
    //   },
    //   data: { isActive },
    // });

    reply.send({ user });
  }
);

type UpsertUserBody = {
  name: string;
  email: string;
  age?: number;
  isActive?: boolean;
};
app.put(
  '/users/upsert',
  async (request: FastifyRequest<{ Body: UpsertUserBody }>, reply) => {
    const { age, email, isActive, name } = request.body;

    const user = await prismaClient.user.upsert({
      where: {
        email,
      },
      create: {
        age,
        email,
        isActive,
        name,
      },
      update: {
        age,
        isActive,
        name,
      },
    });

    reply.send({ user });
  }
);

app.delete(
  '/users/:id',
  async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const { id } = request.params;

    // const user = await prismaClient.user.delete({
    //   where: {
    //     id,
    //   },
    //   select: {
    //     id: true,
    //   },
    // });

    const user = await prismaClient.user.deleteMany({
      where: {
        id,
      },
    });

    reply.send({ user });
  }
);

app.listen({ port: 3001 }).then(() => console.log('Server is running'));
