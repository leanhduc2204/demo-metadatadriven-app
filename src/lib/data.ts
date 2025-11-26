import { faker } from "@faker-js/faker";

export type User = {
  id: number;
  fullName: string;
  emails: string[];
  company: string;
  phones: string[];
  createdBy: string;
  avatar?: string;
  creationDate: string;
  city: string;
  jobTitle: string;
};

const createUsers = (numUser: number) => {
  const users: User[] = [];
  for (let i = 0; i < numUser; i++) {
    users.push({
      id: faker.number.int({ min: 1, max: 50 }),
      fullName: faker.person.fullName(),
      emails: [faker.internet.email()],
      company: faker.company.name(),
      phones: [faker.phone.number()],
      createdBy: faker.person.fullName(),
      avatar: faker.image.avatar(),
      creationDate: faker.date.past().toISOString(),
      city: faker.location.city(),
      jobTitle: faker.person.jobTitle(),
    });
  }
  return users;
};

export const data: User[] = [...createUsers(50)];
