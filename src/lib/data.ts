import { faker } from "@faker-js/faker";
import googleIcon from "@/assets/images/google.png";
import appleIcon from "@/assets/images/apple-logo.png";
import microsoftIcon from "@/assets/images/microsoft.png";
import metaIcon from "@/assets/images/meta.png";

// People data schema

export type User = {
  id: number;
  fullName: string;
  emails: string[];
  company: Company;
  phones: string[];
  createdBy: string;
  avatar?: string;
  creationDate: string;
  city: string;
  jobTitle: string;
};

export type Company = {
  id: number;
  name: string;
  icon: string;
};

export const companies: Company[] = [
  {
    id: 1,
    name: "Google",
    icon: googleIcon.src,
  },
  {
    id: 2,
    name: "Apple",
    icon: appleIcon.src,
  },
  {
    id: 3,
    name: "Microsoft",
    icon: microsoftIcon.src,
  },
  {
    id: 4,
    name: "Meta",
    icon: metaIcon.src,
  },
];

const createUsers = (numUser: number) => {
  const users: User[] = [];
  for (let i = 0; i < numUser; i++) {
    users.push({
      id: i + 1,
      fullName: faker.person.fullName(),
      emails: [faker.internet.email()],
      company: faker.helpers.arrayElement(companies),
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

export const data: User[] = [...createUsers(25)];

// Opportunities data schema

export type Opportunity = {
  id: number;
  name: string;
  amount: number;
  createdBy: string;
  closeDate: string;
  company: Company;
  stage: string;
  pointOfContact: string;
  avatarPointOfContact: string;
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
      id: i + 1,
      name: faker.company.name(),
      amount: faker.number.int({ min: 1000, max: 100000 }),
      createdBy: faker.person.fullName(),
      closeDate: faker.date.future().toISOString(),
      company: faker.helpers.arrayElement(companies),
      stage: faker.helpers.arrayElement(Object.values(Stage)),
      pointOfContact: faker.person.fullName(),
      avatarPointOfContact: faker.image.avatar(),
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

export enum TaskStatus {
  TODO = "Todo",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
}

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  dueDate: string;
  assignee: string;
  createdBy: string;
  creationDate: string;
  deletedAt?: string;
  lastUpdate?: string;
};

const createTasks = (numTask: number) => {
  const tasks: Task[] = [];
  for (let i = 0; i < numTask; i++) {
    tasks.push({
      id: i + 1,
      title: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(Object.values(TaskStatus)),
      dueDate: faker.date.future().toISOString(),
      assignee: faker.person.fullName(),
      createdBy: faker.person.fullName(),
      creationDate: faker.date.past().toISOString(),
      deletedAt: faker.helpers.maybe(() => faker.date.past().toISOString(), {
        probability: 0.5,
      }),
      lastUpdate: faker.date.past().toISOString(),
    });
  }
  return tasks;
};

export const tasks: Task[] = [...createTasks(50)];
