export type Block =
  | SystemBlock
  | ImportBlock
  | CteBlock
  | QuestionBlock
  | MarkdownBlock;

export interface BlockCommon {
  type: "system" | "import" | "cte" | "question" | "markdown";
  id: string; // maybe we might want to assign a block a unique id
  created_at: string; // we don't use type Date for public api
  updated_at: string;
}

export type DataSourceContext = {
  database: Record<
    "string",
    {
      tables: Record<
        "string",
        {
          columns: Record<
            "string",
            {
              // lets keep this minimal as possible
              type: string;
              is_nullable: boolean;
              is_unique: boolean;
              is_primary_key: boolean;
              enum?: string[];
              target?: {
                table: string;
                column: string;
              };
            }
          >;
        }
      >;
    }
  >;
};

export interface SystemBlock extends BlockCommon {
  type: "system";
  query_language: "postgres"; // we only support postgres for now

  /**
   * context goals:
   * - Provide database context, so it can help with autocomplete, error detection, ai code completion, etc.
   */
  context: DataSourceContext;
}

export interface ImportBlock extends BlockCommon {
  type: "import";
  ctes: string[]; // list of cte names
  path: string;
}

export interface CteBlock extends BlockCommon {
  type: "cte";
  name: string;
  is_recursive: boolean;
  expression: string;
}

export interface QuestionBlock extends BlockCommon {
  type: "question";
  query: {
    text: string;
  };
  result: null | {
    data: unknown;
    pagination: null | {
      current_page: number;
      total_pages: number;
      page_size: number;
      total_rows: number;
    };
  };
}

export interface MarkdownBlock extends BlockCommon {
  type: "markdown";
  content: string;
}
