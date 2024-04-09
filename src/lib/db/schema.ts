import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  doublePrecision,
  index,
} from "drizzle-orm/pg-core";

export const profile = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    username: text("username").default(""),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      emailIdx: index("email_idx").on(table.email),
      nameIdx: index("name_idx").on(table.username),
    };
  }
);

export const sketch = pgTable("sketches", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  size: doublePrecision("size"),
  filename: text("filename").notNull(),
  authorId: uuid("author_id").notNull().references(() => profile.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations

export const profilesRelations = relations(profile, ({ many }) => ({
  sketches: many(sketch),
}));

export const sketchRelations = relations(sketch, ({ one }) => ({
  author: one(profile, {
    fields: [sketch.authorId],
    references: [profile.id],
  }),
}));
