scannng779@

DELIMITER $$
CREATE TRIGGER after_insert_player_rate
AFTER INSERT ON player_rate
FOR EACH ROW
BEGIN
  IF NEW.week_id < 22 THEN
    UPDATE user
      SET ptl_lfb = ptl_lfb + NEW.rate
      WHERE id IN (
        SELECT user_id FROM choice WHERE player_id = NEW.player_id AND week_id = NEW.week_id
      );
  ELSE
    UPDATE user
      SET pt_lf2 = pt_lf2 + NEW.rate
      WHERE id IN (
        SELECT user_id FROM choice WHERE player_id = NEW.player_id AND week_id = NEW.week_id
      );
  END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_update_player_rate
AFTER UPDATE ON player_rate
FOR EACH ROW
BEGIN
  DECLARE diff FLOAT;
  SET diff = NEW.rate - OLD.rate;
  IF NEW.week_id < 22 THEN
    UPDATE user
      SET ptl_lfb = ptl_lfb + diff
      WHERE id IN (
        SELECT user_id FROM choice WHERE player_id = NEW.player_id AND week_id = NEW.week_id
      );
  ELSE
    UPDATE user
      SET pt_lf2 = pt_lf2 + diff
      WHERE id IN (
        SELECT user_id FROM choice WHERE player_id = NEW.player_id AND week_id = NEW.week_id
      );
  END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_delete_player_rate
AFTER DELETE ON player_rate
FOR EACH ROW
BEGIN
  IF OLD.week_id < 22 THEN
    UPDATE user
      SET ptl_lfb = ptl_lfb - OLD.rate
      WHERE id IN (
        SELECT user_id FROM choice WHERE player_id = OLD.player_id AND week_id = OLD.week_id
      );
  ELSE
    UPDATE user
      SET pt_lf2 = pt_lf2 - OLD.rate
      WHERE id IN (
        SELECT user_id FROM choice WHERE player_id = OLD.player_id AND week_id = OLD.week_id
      );
  END IF;
END$$
DELIMITER ;