import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  RequestInter,
  status,
} from "../../interfaces/request/requestInterface";

interface RequestState {
  isLoadingRequests: boolean;
  requests: RequestInter[];
}

const initialState: RequestState = {
  isLoadingRequests: true,
  requests: [],
};

export const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    onLoadRequests: (
      state,
      { payload = [] }: PayloadAction<RequestInter[]>
    ) => {
      state.isLoadingRequests = false;
      payload.forEach((request) => {
        const exists = state.requests.some(
          (dbRequest) => dbRequest.rid === request.rid
        );
        if (!exists) {
          state.requests.push(request);
        }
      });
    },
    onCreateRequest: (state, { payload }: PayloadAction<RequestInter>) => {
      state.requests.push(payload);
    },
    onDeleteRequest: (state, { payload }: PayloadAction<string>) => {
      if (payload) {
        state.requests = state.requests.filter(
          (request) => request.rid !== payload
        );
      }
    },
    onMarkRequestStatus: (
      state,
      { payload }: PayloadAction<{ rid: string; status: status }>
    ) => {
      if (payload) {
        state.requests = state.requests.map((request) => {
          if (request.rid === payload.rid) {
            request.status = payload.status;
          }
          return request;
        });
      }
    },
    onLogoutRequests: (state) => {
      state.isLoadingRequests = true;
      state.requests = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onCreateRequest,
  onLoadRequests,
  onDeleteRequest,
  onMarkRequestStatus,
  onLogoutRequests,
} = requestSlice.actions;
