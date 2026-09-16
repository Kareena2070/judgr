"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "../lib/apiClient";

export default function HackathonForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      theme: "",

      registrationStart: "",
      registrationEnd: "",

      submissionStart: "",
      submissionEnd: "",

      judgingStart: "",
      judgingEnd: "",

      teamSize: {
        min: 1,
        max: 5,
      },
    },
  );
  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const status = initialData?.status;

  const canEditAllFields = !isEdit || status === "DRAFT";

  const canEditBasicFields =
    !isEdit ||
    status === "DRAFT" ||
    status === "REGISTRATION" ||
    status === "SUBMISSION";

  const isEditingLocked =
    isEdit && (status === "JUDGING" || status === "COMPLETED");

  function validateForm() {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.theme.trim()) {
      newErrors.theme = "Theme is required";
    }

    if (!formData.registrationStart) {
      newErrors.registrationStart = "Registration start is required";
    }

    if (!formData.registrationEnd) {
      newErrors.registrationEnd = "Registration end is required";
    }

    if (!formData.submissionStart) {
      newErrors.submissionStart = "Submission start is required";
    }

    if (!formData.submissionEnd) {
      newErrors.submissionEnd = "Submission end is required";
    }

    if (!formData.judgingStart) {
      newErrors.judgingStart = "Judging start is required";
    }

    if (!formData.judgingEnd) {
      newErrors.judgingEnd = "Judging end is required";
    }

    if (formData.teamSize.min > formData.teamSize.max) {
      newErrors.teamSize =
        "Minimum team size cannot be greater than maximum team size";
    }

    if (
      formData.registrationStart &&
      formData.registrationEnd &&
      new Date(formData.registrationStart) >= new Date(formData.registrationEnd)
    ) {
      newErrors.registrationEnd =
        "Registration start must be before registration end";
    }

    if (
      formData.registrationEnd &&
      formData.submissionStart &&
      new Date(formData.registrationEnd) > new Date(formData.submissionStart)
    ) {
      newErrors.submissionStart =
        "Registration must end before submission starts";
    }

    if (
      formData.submissionStart &&
      formData.submissionEnd &&
      new Date(formData.submissionStart) >= new Date(formData.submissionEnd)
    ) {
      newErrors.submissionEnd =
        "Submission start must be before submission end";
    }

    if (
      formData.submissionEnd &&
      formData.judgingStart &&
      new Date(formData.submissionEnd) > new Date(formData.judgingStart)
    ) {
      newErrors.judgingStart = "Submission must end before judging starts";
    }

    if (
      formData.judgingStart &&
      formData.judgingEnd &&
      new Date(formData.judgingStart) >= new Date(formData.judgingEnd)
    ) {
      newErrors.judgingEnd = "Judging start must be before judging end";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm();

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      let response;

      if (isEdit) {
        let updateData;

        if (
          initialData.status === "REGISTRATION" ||
          initialData.status === "SUBMISSION"
        ) {
          updateData = {
            title: formData.title,
            description: formData.description,
            theme: formData.theme,
          };
        } else if (
          initialData.status === "JUDGING" ||
          initialData.status === "COMPLETED"
        ) {
          updateData = {};
        } else {
          // DRAFT
          updateData = formData;
        }

        response = await apiClient.patch(
          `/hackathons/${initialData._id}`,
          updateData,
        );

        console.log("Hackathon updated:", response.data);
      } else {
        response = await apiClient.post("/hackathons", formData);

        console.log("Hackathon created:", response.data);
      }

      router.push("/hackathons");
    } catch (error) {
      console.error("UPDATE ERROR STATUS:", error.response?.status);
      console.error("UPDATE ERROR DATA:", error.response?.data);
      console.error("UPDATE ERROR MESSAGE:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6 pb-24" onSubmit={handleSubmit}>
      {isEdit && status === "REGISTRATION" && (
        <p className="rounded-md bg-[#dbeafe] px-4 py-3 text-sm leading-5 text-[#1d4ed8]">
          Registration has started. You can still edit the title, description,
          and theme, but dates and team size are locked.
        </p>
      )}

      {isEdit && status === "SUBMISSION" && (
        <p className="rounded-md bg-[#fef3c7] px-4 py-3 text-sm leading-5 text-[#a16207]">
          Submission is in progress. You can still edit the title, description,
          and theme, but dates and team size are locked.
        </p>
      )}

      {isEditingLocked && (
        <p className="rounded-md bg-[#fee2e2] px-4 py-3 text-sm leading-5 text-[#b91c1c]">
          This hackathon can no longer be edited because judging has started or
          completed.
        </p>
      )}
      <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2563eb]">Basics</p>
        <div className="mt-5 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#171717]" htmlFor="title">Title</label>
            <input className="mt-2 h-11 w-full rounded-md border border-[#e5e5e0] px-3 text-sm text-[#171717] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:bg-[#f1f1ee]" id="title" type="text" disabled={!canEditBasicFields} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            {errors.title && <p className="mt-2 text-sm text-[#b91c1c]">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#171717]" htmlFor="description">Description</label>
            <textarea className="mt-2 min-h-28 w-full rounded-md border border-[#e5e5e0] px-3 py-2 text-sm leading-6 text-[#171717] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:bg-[#f1f1ee]" id="description" disabled={!canEditBasicFields} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            {errors.description && <p className="mt-2 text-sm text-[#b91c1c]">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#171717]" htmlFor="theme">Theme</label>
            <input className="mt-2 h-11 w-full rounded-md border border-[#e5e5e0] px-3 text-sm text-[#171717] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:bg-[#f1f1ee]" id="theme" type="text" disabled={!canEditBasicFields} value={formData.theme} onChange={(e) => setFormData({ ...formData, theme: e.target.value })} />
            {errors.theme && <p className="mt-2 text-sm text-[#b91c1c]">{errors.theme}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2563eb]">Dates</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div><label className="block text-sm font-semibold text-[#171717]" htmlFor="registrationStart">Registration Start</label><input className="mt-2 h-11 w-full rounded-md border border-[#e5e5e0] px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:bg-[#f1f1ee]" id="registrationStart" type="datetime-local" disabled={!canEditAllFields} value={formData.registrationStart} onChange={(e) => setFormData({ ...formData, registrationStart: e.target.value })} />{errors.registrationStart && <p className="mt-2 text-sm text-[#b91c1c]">{errors.registrationStart}</p>}</div>
          <div><label className="block text-sm font-semibold text-[#171717]" htmlFor="registrationEnd">Registration End</label><input className="mt-2 h-11 w-full rounded-md border border-[#e5e5e0] px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:bg-[#f1f1ee]" id="registrationEnd" type="datetime-local" disabled={!canEditAllFields} value={formData.registrationEnd} onChange={(e) => setFormData({ ...formData, registrationEnd: e.target.value })} />{errors.registrationEnd && <p className="mt-2 text-sm text-[#b91c1c]">{errors.registrationEnd}</p>}</div>
          <div><label className="block text-sm font-semibold text-[#171717]" htmlFor="submissionStart">Submission Start</label><input className="mt-2 h-11 w-full rounded-md border border-[#e5e5e0] px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:bg-[#f1f1ee]" id="submissionStart" type="datetime-local" disabled={!canEditAllFields} value={formData.submissionStart} onChange={(e) => setFormData({ ...formData, submissionStart: e.target.value })} />{errors.submissionStart && <p className="mt-2 text-sm text-[#b91c1c]">{errors.submissionStart}</p>}</div>
          <div><label className="block text-sm font-semibold text-[#171717]" htmlFor="submissionEnd">Submission End</label><input className="mt-2 h-11 w-full rounded-md border border-[#e5e5e0] px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:bg-[#f1f1ee]" id="submissionEnd" type="datetime-local" disabled={!canEditAllFields} value={formData.submissionEnd} onChange={(e) => setFormData({ ...formData, submissionEnd: e.target.value })} />{errors.submissionEnd && <p className="mt-2 text-sm text-[#b91c1c]">{errors.submissionEnd}</p>}</div>
          <div><label className="block text-sm font-semibold text-[#171717]" htmlFor="judgingStart">Judging Start</label><input className="mt-2 h-11 w-full rounded-md border border-[#e5e5e0] px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:bg-[#f1f1ee]" id="judgingStart" type="datetime-local" disabled={!canEditAllFields} value={formData.judgingStart} onChange={(e) => setFormData({ ...formData, judgingStart: e.target.value })} />{errors.judgingStart && <p className="mt-2 text-sm text-[#b91c1c]">{errors.judgingStart}</p>}</div>
          <div><label className="block text-sm font-semibold text-[#171717]" htmlFor="judgingEnd">Judging End</label><input className="mt-2 h-11 w-full rounded-md border border-[#e5e5e0] px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:bg-[#f1f1ee]" id="judgingEnd" type="datetime-local" disabled={!canEditAllFields} value={formData.judgingEnd} onChange={(e) => setFormData({ ...formData, judgingEnd: e.target.value })} />{errors.judgingEnd && <p className="mt-2 text-sm text-[#b91c1c]">{errors.judgingEnd}</p>}</div>
        </div>
      </section>

      <section className="rounded-xl border border-[#e5e5e0] bg-white p-6 shadow-[0_1px_3px_rgba(23,23,23,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2563eb]">Team Size</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div><label className="block text-sm font-semibold text-[#171717]" htmlFor="teamSizeMin">Minimum Team Size</label><input className="mt-2 h-11 w-full rounded-md border border-[#e5e5e0] px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:bg-[#f1f1ee]" id="teamSizeMin" type="number" disabled={!canEditAllFields} value={formData.teamSize.min} onChange={(e) => setFormData({ ...formData, teamSize: { ...formData.teamSize, min: Number(e.target.value) } })} /></div>
          <div><label className="block text-sm font-semibold text-[#171717]" htmlFor="teamSizeMax">Maximum Team Size</label><input className="mt-2 h-11 w-full rounded-md border border-[#e5e5e0] px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:bg-[#f1f1ee]" id="teamSizeMax" type="number" disabled={!canEditAllFields} value={formData.teamSize.max} onChange={(e) => setFormData({ ...formData, teamSize: { ...formData.teamSize, max: Number(e.target.value) } })} />{errors.teamSize && <p className="mt-2 text-sm text-[#b91c1c]">{errors.teamSize}</p>}</div>
        </div>
      </section>

      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 rounded-lg border border-[#e5e5e0] bg-white/95 p-3 shadow-[0_1px_3px_rgba(23,23,23,0.06)] backdrop-blur">
        <Link className="rounded-md border border-[#e5e5e0] px-4 py-2 text-sm font-semibold text-[#737373] hover:border-[#171717] hover:text-[#171717]" href="/admin/hackathons">
          Cancel
        </Link>
        {!isEditingLocked && (
          <button className="inline-flex h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:bg-[#a3a3a3]" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Hackathon" : "Create Hackathon"}
          </button>
        )}
      </div>
    </form>
  );
}
