import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  createProfile,
  generateBioWithAIParams,
  RefineBioParams,
} from "../actions";
import { useUser } from "@/hooks/useUser";
import useGenerateBioWithAI from "../hooks/user-profile-hooks/useGenerateBioWithAI";
import useRefineBioWithAI from "../hooks/user-profile-hooks/useRefineBioWithAI";

// Define the state interface
export interface CreateProfileState {
  currentStep: number;
  userInformation: {
    jobTitle: string;
    skills: string[];
    bio: string;
    isDefaultProfile: boolean;
    name: string;
  };
}

// Define action types
type CreateProfileAction =
  | { type: "SET_JOB_TITLE"; payload: string }
  | { type: "SET_SKILLS"; payload: string[] }
  | { type: "SET_BIO"; payload: string }
  | { type: "SET_DEFAULT_PROFILE"; payload: boolean }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" }
  | { type: "SET_NAME"; payload: string };

// Define initial state
const initialState: CreateProfileState = {
  currentStep: 1,
  userInformation: {
    jobTitle: "",
    skills: [],
    bio: "",
    isDefaultProfile: false,
    name: "",
  },
};

// Create reducer function
function formReducer(state: CreateProfileState, action: CreateProfileAction) {
  switch (action.type) {
    case "SET_JOB_TITLE":
      return {
        ...state,
        userInformation: { ...state.userInformation, jobTitle: action.payload },
      };
    case "SET_NAME":
      return {
        ...state,
        userInformation: { ...state.userInformation, name: action.payload },
      };
    case "SET_SKILLS":
      return {
        ...state,
        userInformation: { ...state.userInformation, skills: action.payload },
      };
    case "SET_BIO":
      return {
        ...state,
        userInformation: { ...state.userInformation, bio: action.payload },
      };
    case "SET_DEFAULT_PROFILE":
      return {
        ...state,
        userInformation: {
          ...state.userInformation,
          isDefaultProfile: action.payload,
        },
      };
    case "NEXT_STEP":
      return { ...state, currentStep: state.currentStep + 1 };
    case "PREV_STEP":
      return { ...state, currentStep: state.currentStep - 1 };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// Create context type
export interface CreateProfileContextType {
  state: CreateProfileState;
  setJobTitle: (jobTitle: string) => void;
  setSkills: (skills: string[]) => void;
  setBio: (bio: string) => void;
  setDefaultProfile: (isDefault: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  generateBio: UseMutateFunction<
    | {
        bio: string;
      }
    | undefined,
    Error,
    generateBioWithAIParams,
    unknown
  >;
  refineBio: UseMutateFunction<
    | {
        refinedBio: string;
      }
    | undefined,
    Error,
    RefineBioParams,
    unknown
  >;
  createFreelanceProfile: () => void;
  bioText: string;
  isGenerating: boolean;
  isRefining: boolean;
  isLoading: boolean;
  isCreatingProfile: boolean;
}

// Create context with default value
const CreateProfileContext = createContext<
  CreateProfileContextType | undefined
>(undefined);

// Create provider props type
interface CreateProfileProviderProps {
  children: ReactNode;
}

// Create provider component
export const CreateProfileProvider: React.FC<CreateProfileProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [bioText, setBioText] = useState<string>(
    state.userInformation.bio || ""
  );

  const { data: userDetails, isPending: isUserQueryPending } = useUser();
  const {
    generateBio,
    generateBioSuccessFull,
    generatedBioData,
    genrateBioPending,
    resetGenerateBioState,
  } = useGenerateBioWithAI();

  const {
    refineBioData,
    refineBioSuccess,
    resetRefineBioState,
    refineBio,
    isRefiningBio,
  } = useRefineBioWithAI();

  // const { mutate: generateBio, isPending: genrateBioPending } = useMutation({
  //   mutationFn: async () => {
  //     return generateBioWithAI(state);
  //   },
  //   onSuccess: (data) => {
  //     if (data) {
  //       setBioText(data.bio);
  //       // Save generated bio to state
  //       dispatch({ type: "SET_BIO", payload: data.bio });
  //     }
  //   },
  //   onError: (error) => {
  //     console.error("Error generating bio:", error);
  //   },
  // });
  // const { mutate: refineBio, isPending: refineBioPending } = useMutation({
  //   mutationFn: async () => {
  //     return refineBioWithAI({ bioText, state });
  //   },
  //   onSuccess: (data) => {
  //     if (data) {
  //       setBioText(data.refinedBio);
  //       // Save generated bio to state
  //       dispatch({ type: "SET_BIO", payload: data.refinedBio });
  //     }
  //   },
  //   onError: (error) => {
  //     console.error("Error generating bio:", error);
  //   },
  // });

  const { mutate: createFreelanceProfile, isPending: createProfilePending } =
    useMutation({
      mutationFn: async () => {
        return createProfile(state);
      },
      onSuccess: (data) => {
        if (data) {
          console.log("Profile created successfully:", data);
        }
      },
      onError: (error) => {
        console.error("Error generating bio:", error);
      },
    });

  // Set user name in state if available

  useEffect(() => {
    if (userDetails && !state.userInformation.name) {
      dispatch({ type: "SET_NAME", payload: userDetails.fullName });
    }
  }, [userDetails, state.userInformation.name]);

  // Action creators
  const setJobTitle = (jobTitle: string) => {
    dispatch({ type: "SET_JOB_TITLE", payload: jobTitle });
  };

  const setSkills = (skills: string[]) => {
    dispatch({ type: "SET_SKILLS", payload: skills });
  };

  const setBio = (bio: string) => {
    setBioText(bio); // Update local state
    // Save bio to state
    dispatch({ type: "SET_BIO", payload: bio });
  };

  const setDefaultProfile = (isDefault: boolean) => {
    dispatch({ type: "SET_DEFAULT_PROFILE", payload: isDefault });
  };

  const nextStep = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const prevStep = () => {
    dispatch({ type: "PREV_STEP" });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  if (generateBioSuccessFull && generatedBioData) {
    // Set generated bio in local state
    setBioText(generatedBioData.bio);
    // Save generated bio to state
    dispatch({ type: "SET_BIO", payload: generatedBioData.bio });

    resetGenerateBioState(); // Reset the generate bio state
  }

  if (refineBioSuccess && refineBioData) {
    // Set generated bio in local state
    setBioText(refineBioData.refinedBio);
    // Save generated bio to state
    dispatch({ type: "SET_BIO", payload: refineBioData.refinedBio });

    resetRefineBioState(); // Reset the generate bio state
  }

  const isLoading = isUserQueryPending;
  const isGenerating = genrateBioPending;
  const isRefining = isRefiningBio;
  const isCreatingProfile = createProfilePending;

  // Context value
  const value = {
    bioText,
    state,
    setJobTitle,
    setSkills,
    setBio,
    setDefaultProfile,
    nextStep,
    prevStep,
    reset,
    generateBio,
    refineBio,
    isLoading,
    isGenerating,
    isRefining,
    createFreelanceProfile,
    isCreatingProfile,
  };

  return (
    <CreateProfileContext.Provider value={value}>
      {children}
    </CreateProfileContext.Provider>
  );
};

// Create custom hook for using this context
export const useCreateProfileContext = (): CreateProfileContextType => {
  const context = useContext(CreateProfileContext);
  if (context === undefined) {
    throw new Error(
      "useCreateProfile must be used within a CreateProfileProvider"
    );
  }
  return context;
};
