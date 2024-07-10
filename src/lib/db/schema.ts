import { InferSelectModel, relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";

export const profile = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    username: text("username").default("").notNull(),
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

export const sketch = pgTable(
  "sketches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull(),
    originalName: text("original_name").notNull(),
    filename: text("filename").notNull(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => profile.id),
    ipAddresses: text("ip_addresses").array(),
    // .default(sql`'{}'::text[]`),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    // views: integer("views").notNull().default(0),
    // canvasBg: text("canvas_bg").default("#ffffff"),
    // canvasPath: json("canvas_path::json[]").default([
    //   {
    //     paths: [{ x: 0, y: 0 }],
    //     strokeWidth: 5,
    //     strokeColor: "#000000",
    //     drawMode: false,
    //   },
    // ]),
  },
  (table) => {
    return {
      fileIdx: index("file_idx").on(table.filename),
      authorIdx: index("author_idx").on(table.authorId),
    };
  }
);

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

// Types
export type IProfile = InferSelectModel<typeof profile>;
export type ISketch = InferSelectModel<typeof sketch>;
