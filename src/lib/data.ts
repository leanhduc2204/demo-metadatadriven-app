import { faker } from "@faker-js/faker";

// People data schema

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

export const data: User[] = [...createUsers(10)];

// Opportunities data schema

export type Opportunity = {
  id: number;
  name: string;
  amount: number;
  createdBy: string;
  closeDate: string;
  company: string;
  stage: string;
  pointOfContact: string;
  creationDate: string;
  deletedAt?: string;
  lastUpdate?: string;
};

export enum Stage {
  NEW = "New",
  SCREENING = "Screening",
  MEETING = "Meeting",
  PROPOSAL = "Proposal",
  CUSTOMER = "Customer",
}

const createOpportunities = (numOpportunity: number) => {
  const opportunities: Opportunity[] = [];
  for (let i = 0; i < numOpportunity; i++) {
    opportunities.push({
      id: faker.number.int({ min: 1, max: 50 }),
      name: faker.company.name(),
      amount: faker.number.int({ min: 1000, max: 100000 }),
      createdBy: faker.person.fullName(),
      closeDate: faker.date.future().toISOString(),
      company: faker.company.name(),
      stage: faker.helpers.arrayElement(Object.values(Stage)),
      pointOfContact: faker.person.fullName(),
      creationDate: faker.date.past().toISOString(),
      deletedAt: faker.helpers.maybe(() => faker.date.past().toISOString(), {
        probability: 0.5,
      }),
      lastUpdate: faker.date.past().toISOString(),
    });
  }
  return opportunities;
};

export const opportunities: Opportunity[] = [...createOpportunities(50)];
