import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  doublePrecision,
  index,
  serial,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    fullName: text("fullName").notNull().unique(),
    // avatarUrl: text("avatar_url"),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.fullName),
    };
  }
);

export const sketch = pgTable("sketches", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  size: doublePrecision("size"),
  filename: text("filename").notNull(),
  authorId: integer("author_id").references(() => user.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
