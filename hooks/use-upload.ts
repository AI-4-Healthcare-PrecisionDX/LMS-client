/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import api from "@/lib/axios-config";
import { AxiosError } from "axios";
import { useReducer } from "react";

// Define the initial state
const initialState = {
  loading: false,
  error: null,
  success: false,
};

const UPLOAD_ACTIONS = {
  START: "start",
  SUCCESS: "success",
  FAILURE: "failure",
  RESET: "reset",
};

interface UploadState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface UploadAction {
  type: string;
  payload?: string | null;
}

const uploadReducer = (
  _state: UploadState,
  action: UploadAction,
): UploadState => {
  switch (action.type) {
    case UPLOAD_ACTIONS.START:
      return { loading: true, error: null, success: false };
    case UPLOAD_ACTIONS.SUCCESS:
      return { loading: false, error: null, success: true };
    case UPLOAD_ACTIONS.FAILURE:
      return { loading: false, error: action.payload ?? null, success: false };
    case UPLOAD_ACTIONS.RESET:
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const useFileUpload = () => {
  const [state, dispatch] = useReducer(uploadReducer, initialState);

  const uploadFile = async ({
    pdfFile,
    jsonFile,
    materialType,
    materialTitle,
    materialDescription = null,
    author = null,
    visibility = true,
  }: {
    pdfFile: File;
    jsonFile?: File;
    materialType: string;
    materialTitle: string;
    materialDescription?: string | null;
    author?: string | null;
    visibility?: boolean;
  }) => {
    dispatch({ type: UPLOAD_ACTIONS.START });

    try {
      const formData = new FormData();
      formData.append("pdf_file", pdfFile);
      if (jsonFile) formData.append("json_file", jsonFile);
      formData.append("material_type", materialType);
      formData.append("material_title", materialTitle);
      if (materialDescription)
        formData.append("material_description", materialDescription);
      if (author) formData.append("author", author);
      formData.append("visibility", visibility.toString());

      const response = await api.post("/utils/library/file_upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch({ type: UPLOAD_ACTIONS.SUCCESS });
      return response.data;
    } catch (err: AxiosError | any) {
      dispatch({
        type: UPLOAD_ACTIONS.FAILURE,
        payload: err.response?.data.message,
      });

      throw err;
    }
  };

  const getLibraries = async () => {
    dispatch({ type: UPLOAD_ACTIONS.START });

    try {
      const response = await api.get("/utils/libraries");

      dispatch({ type: UPLOAD_ACTIONS.SUCCESS });
      return response.data;
    } catch (err: AxiosError | any) {
      dispatch({
        type: UPLOAD_ACTIONS.FAILURE,
        payload: err.response?.data.message,
      });

      throw err;
    }
  };

  const getLibraryById = async (id: string) => {
    dispatch({ type: UPLOAD_ACTIONS.START });

    try {
      const response = await api.get(`/utils/library/${id}`);

      dispatch({ type: UPLOAD_ACTIONS.SUCCESS });
      return response.data;
    } catch (err: AxiosError | any) {
      dispatch({
        type: UPLOAD_ACTIONS.FAILURE,
        payload: err.response?.data.message,
      });

      throw err;
    }
  };

  const getLibraryFileByLibraryID = async (id: string) => {
    dispatch({ type: UPLOAD_ACTIONS.START });

    try {
      const response = await api.get(`/utils/library/${id}/file`);

      dispatch({ type: UPLOAD_ACTIONS.SUCCESS });
      const proxyUrl = `/teacher/api/getPdf?url=${encodeURIComponent(response.data.file_url)}`;
      return proxyUrl;
    } catch (err: AxiosError | any) {
      dispatch({
        type: UPLOAD_ACTIONS.FAILURE,
        payload: err.response?.data.message,
      });

      throw err;
    }
  };

  const getLibraryFileForCourseByLibraryID = async (id: string) => {
    dispatch({ type: UPLOAD_ACTIONS.START });

    try {
      const response = await api.get(
        `/utils/library_course_section/file/${id}`,
      );

      dispatch({ type: UPLOAD_ACTIONS.SUCCESS });
      const proxyUrl = `/teacher/api/getPdf?url=${encodeURIComponent(
        response.data.file_url,
      )}`;
      return proxyUrl;
    } catch (err: AxiosError | any) {
      dispatch({
        type: UPLOAD_ACTIONS.FAILURE,
        payload: err.response?.data.message,
      });

      throw err;
    }
  };

  const resetState = () => dispatch({ type: UPLOAD_ACTIONS.RESET });

  return {
    ...state,
    uploadFile,
    getLibraries,
    getLibraryById,
    getLibraryFileByLibraryID,
    getLibraryFileForCourseByLibraryID,
    resetState,
  };
};

export default useFileUpload;
