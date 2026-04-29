DELETE FROM communities;

ALTER TABLE communities
  ADD COLUMN created_by INTEGER NOT NULL
  REFERENCES users(id);