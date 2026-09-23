import { Router } from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { idParamSchema } from "../validators/common.validator.js";
import { createTestimonialSchema, updateTestimonialSchema } from "../validators/testimonial.validator.js";
import * as testimonialController from "../controllers/testimonial.controller.js";

const router = Router();

router.get("/", asyncHandler(testimonialController.getTestimonials));
router.get("/admin", protect, authorize("admin"), asyncHandler(testimonialController.getTestimonials));

router.post("/", protect, validate(createTestimonialSchema), asyncHandler(testimonialController.createTestimonial));
router.patch("/:id", protect, authorize("admin"), validate(updateTestimonialSchema), asyncHandler(testimonialController.updateTestimonial));
router.delete("/:id", protect, authorize("admin"), validate(idParamSchema), asyncHandler(testimonialController.deleteTestimonial));

export default router;