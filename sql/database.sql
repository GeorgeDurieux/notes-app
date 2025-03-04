CREATE SEQUENCE IF NOT EXISTS notes_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS public.notes
(
    id integer NOT NULL DEFAULT nextval('notes_id_seq'::regclass),
    content text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'active'::character varying,
    CONSTRAINT notes_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;
