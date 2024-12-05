export interface JWTErrorResponse {
  detail:   string;
  code:     string;
  messages: Message[];
}

export interface Message {
  token_class: string;
  token_type:  string;
  message:     string;
}
