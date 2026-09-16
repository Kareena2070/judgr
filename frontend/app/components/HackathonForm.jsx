"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <form onSubmit={handleSubmit}>
      {isEdit && status === "REGISTRATION" && (
        <p>
          Registration has started. You can still edit the title, description,
          and theme, but dates and team size are locked.
        </p>
      )}

      {isEdit && status === "SUBMISSION" && (
        <p>
          Submission is in progress. You can still edit the title, description,
          and theme, but dates and team size are locked.
        </p>
      )}

      {isEditingLocked && (
        <p>
          This hackathon can no longer be edited because judging has started or
          completed.
        </p>
      )}
      {/* fields will come here */}
      <label htmlFor="title">Title</label>

      <input
        id="title"
        type="text"
        disabled={!canEditBasicFields}
        value={formData.title}
        onChange={(e) =>
          setFormData({
            ...formData,
            title: e.target.value,
          })
        }
      />

      {errors.title && <p>{errors.title}</p>}

      <label htmlFor="description">Description</label>

      <textarea
        id="description"
        disabled={!canEditBasicFields}
        value={formData.description}
        onChange={(e) =>
          setFormData({
            ...formData,
            description: e.target.value,
          })
        }
      />
      {errors.description && <p>{errors.description}</p>}

      <label htmlFor="theme">Theme</label>

      <input
        id="theme"
        type="text"
        disabled={!canEditBasicFields}
        value={formData.theme}
        onChange={(e) =>
          setFormData({
            ...formData,
            theme: e.target.value,
          })
        }
      />

      {errors.theme && <p>{errors.theme}</p>}

      <label htmlFor="registrationStart">Registration Start</label>

      <input
        id="registrationStart"
        type="datetime-local"
        disabled={!canEditAllFields}
        value={formData.registrationStart}
        onChange={(e) =>
          setFormData({
            ...formData,
            registrationStart: e.target.value,
          })
        }
      />

      {errors.registrationStart && <p>{errors.registrationStart}</p>}

      <label htmlFor="registrationEnd">Registration End</label>

      <input
        id="registrationEnd"
        type="datetime-local"
        disabled={!canEditAllFields}
        value={formData.registrationEnd}
        onChange={(e) =>
          setFormData({
            ...formData,
            registrationEnd: e.target.value,
          })
        }
      />

      {errors.registrationEnd && <p>{errors.registrationEnd}</p>}

      {/* Submission */}

      <label htmlFor="submissionStart">Submission Start</label>

      <input
        id="submissionStart"
        type="datetime-local"
        disabled={!canEditAllFields}
        value={formData.submissionStart}
        onChange={(e) =>
          setFormData({
            ...formData,
            submissionStart: e.target.value,
          })
        }
      />

      {errors.submissionStart && <p>{errors.submissionStart}</p>}

      <label htmlFor="submissionEnd">Submission End</label>

      <input
        id="submissionEnd"
        type="datetime-local"
        disabled={!canEditAllFields}
        value={formData.submissionEnd}
        onChange={(e) =>
          setFormData({
            ...formData,
            submissionEnd: e.target.value,
          })
        }
      />

      {errors.submissionEnd && <p>{errors.submissionEnd}</p>}

      {/* Judging */}

      <label htmlFor="judgingStart">Judging Start</label>

      <input
        id="judgingStart"
        type="datetime-local"
        disabled={!canEditAllFields}
        value={formData.judgingStart}
        onChange={(e) =>
          setFormData({
            ...formData,
            judgingStart: e.target.value,
          })
        }
      />

      {errors.judgingStart && <p>{errors.judgingStart}</p>}

      <label htmlFor="judgingEnd">Judging End</label>

      <input
        id="judgingEnd"
        type="datetime-local"
        disabled={!canEditAllFields}
        value={formData.judgingEnd}
        onChange={(e) =>
          setFormData({
            ...formData,
            judgingEnd: e.target.value,
          })
        }
      />

      {errors.judgingEnd && <p>{errors.judgingEnd}</p>}

      <label htmlFor="teamSizeMin">Minimum Team Size</label>

      <input
        id="teamSizeMin"
        type="number"
        disabled={!canEditAllFields}
        value={formData.teamSize.min}
        onChange={(e) =>
          setFormData({
            ...formData,
            teamSize: {
              ...formData.teamSize,
              min: Number(e.target.value),
            },
          })
        }
      />

      <label htmlFor="teamSizeMax">Maximum Team Size</label>

      <input
        id="teamSizeMax"
        type="number"
        disabled={!canEditAllFields}
        value={formData.teamSize.max}
        onChange={(e) =>
          setFormData({
            ...formData,
            teamSize: {
              ...formData.teamSize,
              max: Number(e.target.value),
            },
          })
        }
      />

      {errors.teamSize && <p>{errors.teamSize}</p>}

      {!isEditingLocked && (
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
              ? "Update Hackathon"
              : "Create Hackathon"}
        </button>
      )}
    </form>
  );
}
