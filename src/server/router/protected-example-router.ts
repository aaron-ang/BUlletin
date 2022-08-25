import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedExampleRouter = createProtectedRouter()
  .query("getUser", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          course: true,
        },
      });
    },
  })
  .mutation("updateUserCourse", {
    input: z.object({
      college: z.string(),
      department: z.string(),
      courseNumber: z.string(),
      section: z.string(),
    }),
    async resolve({ ctx, input }) {
      let course = await ctx.prisma.course.findFirst({
        where: {
          college: input.college,
          department: input.department,
          courseNumber: input.courseNumber,
          section: input.section,
        },
      });
      if (!course) {
        course = await ctx.prisma.course.create({
          data: {
            college: input.college,
            department: input.department,
            courseNumber: input.courseNumber,
            section: input.section,
          },
        });
      }
      console.log("courseId: " + course.id)
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          course: {
            connect: {
              id: course.id,
            },
          },
        },
      });
    },
  })
  .query("getSecretMessage", {
    resolve({}) {
      return "He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.";
    },
  });
