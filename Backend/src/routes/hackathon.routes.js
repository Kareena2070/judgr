const express = require("express");
const { z } = require("zod");
const validate = require("../middlewares/validate.js");
const hackathonController = require("../controllers/hackathon.controller.js");
const authenticate = require("../middlewares/authenticate.js");
const requireRole = require("../middlewares/authorize.js");
const router = express.Router();

const createHackathonSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(150),

    description: z.string().trim().min(1).max(5000),

    theme: z.string().trim().min(1).max(200),

    registrationStart: z.coerce.date(),
    registrationEnd: z.coerce.date(),
    submissionStart: z.coerce.date(),
    submissionEnd: z.coerce.date(),
    judgingStart: z.coerce.date(),
    judgingEnd: z.coerce.date(),

    teamSize: z.object({
      min: z.number().int().min(1),
      max: z.number().int().min(1),
    }),
  }),
});

const listHackathonsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z
      .enum(["DRAFT", "REGISTRATION", "SUBMISSION", "JUDGING", "COMPLETED"])
      .optional(),
    search: z.string().trim().optional(),
  }),
});

const updateHackathonSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),

  body: z
    .object({
      title: z.string().trim().min(3).max(150).optional(),

      description: z.string().trim().min(1).max(5000).optional(),

      theme: z.string().trim().min(1).max(200).optional(),

      registrationStart: z.coerce.date().optional(),
      registrationEnd: z.coerce.date().optional(),
      submissionStart: z.coerce.date().optional(),
      submissionEnd: z.coerce.date().optional(),
      judgingStart: z.coerce.date().optional(),
      judgingEnd: z.coerce.date().optional(),

      teamSize: z
        .object({
          min: z.number().int().min(1),
          max: z.number().int().min(1),
        })
        .optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required for update",
    }),
});

router.post(
  "/",
  authenticate,
  requireRole("admin"),
  validate(createHackathonSchema),
  hackathonController.createHackathonController,
);

router.get(
  "/",
  authenticate,
  validate(listHackathonsSchema),
  hackathonController.listHackathonsController,
);

router.get(
  "/:id",
  authenticate,
  hackathonController.getHackathonByIdController,
);

router.patch(
  "/:id",
  authenticate,
  requireRole("admin"),
  validate(updateHackathonSchema),
  hackathonController.updateHackathonController,
);

module.exports = router;
