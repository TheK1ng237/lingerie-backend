import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { subscribeNewsletterSchema } from "../validators/newsletter.validator.js";
import * as newsletterController from "../controllers/newsletter.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { idParamSchema } from "../validators/common.validator.js";
import { campaignSchema, updateCampaignSchema, updateSubscriberSchema } from "../validators/newsletter.validator.js";

const router = Router();

router.post("/subscribe", validate(subscribeNewsletterSchema), asyncHandler(newsletterController.subscribe));

router.use(protect, authorize("admin"));
router.get("/subscribers", asyncHandler(newsletterController.getSubscribers));
router.patch("/subscribers/:id", validate(idParamSchema.merge(updateSubscriberSchema)), asyncHandler(newsletterController.updateSubscriber));
router.delete("/subscribers/:id", validate(idParamSchema), asyncHandler(newsletterController.deleteSubscriber));
router.get("/campaigns", asyncHandler(newsletterController.getCampaigns));
router.post("/campaigns", validate(campaignSchema), asyncHandler(newsletterController.createCampaign));
router.patch("/campaigns/:id", validate(idParamSchema.merge(updateCampaignSchema)), asyncHandler(newsletterController.updateCampaign));
router.delete("/campaigns/:id", validate(idParamSchema), asyncHandler(newsletterController.deleteCampaign));
router.post("/campaigns/:id/send", validate(idParamSchema), asyncHandler(newsletterController.sendCampaign));

export default router;
