export interface Criteria {
    id: number;
    category_id: number;
    title: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    description: string;
    about: string | null;
    status: number;
    order: number;
    image: string;
    has_voted: boolean;
    criteria: Criteria[];
  }
  
  export interface Nominee {
    name: string;
    username: string;
    number_of_followers: string;
    nominee_id: string;
    image: string;
    category_id: number;
    total_vote_count: number;
  }
  
  export interface CategoryNomineesResponse {
    category: Category;
    nominees: Nominee[];
  }