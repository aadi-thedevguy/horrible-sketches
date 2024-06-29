import { db } from ".";
import { generateRandomString } from "../utils";
import { sketch } from "./schema";

async function seedSketches() {
  try {
    await db.insert(sketch).values([
      {
        authorId: "f290edb2-44fa-425d-9455-f300fe125ac0",
        sharableAuthorId: generateRandomString(),
        filename: "sketch1",
        url: "https://picsum.photos/id/20/200/300",
      },
      {
        authorId: "f290edb2-44fa-425d-9455-f300fe125ac0",
        sharableAuthorId: generateRandomString(),
        filename: "sketch2",
        url: "https://picsum.photos/id/21/200/300",
      },
      {
        authorId: "f290edb2-44fa-425d-9455-f300fe125ac0",
        sharableAuthorId: generateRandomString(),
        filename: "sketch3",
        url: "https://picsum.photos/id/22/200/300",
      },
      {
        authorId: "f290edb2-44fa-425d-9455-f300fe125ac0",
        sharableAuthorId: generateRandomString(),
        filename: "sketch4",
        url: "https://picsum.photos/id/230/200/300",
      },
      {
        authorId: "f290edb2-44fa-425d-9455-f300fe125ac0",
        sharableAuthorId: generateRandomString(),
        filename: "sketch5",
        url: "https://picsum.photos/id/240/200/300",
      },
      {
        authorId: "f290edb2-44fa-425d-9455-f300fe125ac0",
        sharableAuthorId: generateRandomString(),
        filename: "sketch6",
        url: "https://picsum.photos/id/250/200/300",
      },
    ]);
  } catch (error) {
    console.error(error);
  }
}
// seedSketches();
