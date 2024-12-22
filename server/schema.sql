CREATE TABLE members (
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(100) NOT NULL,
                         email VARCHAR(100) UNIQUE NOT NULL,
                         join_date DATE NOT NULL,
                         membership_type VARCHAR(50) NOT NULL
);

CREATE TABLE trainers (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          specialization VARCHAR(100) NOT NULL

);

CREATE TABLE classes (
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(100) NOT NULL,
                         trainer_id INTEGER REFERENCES trainers(id),
                         schedule VARCHAR(100) NOT NULL,
                         capacity INTEGER NOT NULL
);

CREATE TABLE memberships (
                             id SERIAL PRIMARY KEY,
                             member_id INTEGER REFERENCES members(id),
                             class_id INTEGER REFERENCES classes(id),
                             start_date DATE NOT NULL,
                             end_date DATE NOT NULL
);

CREATE TABLE equipment (
                           id SERIAL PRIMARY KEY,
                           name VARCHAR(100) NOT NULL,
                           quantity INTEGER NOT NULL,
                           last_maintenance_date DATE
);


ALTER TABLE trainers
    ADD COLUMN email VARCHAR(255) NOT NULL;


INSERT INTO members (name, email, join_date, membership_type) VALUES
                                                                  ('John Doe', 'john.doe@email.com', '2023-01-15', 'Premium'),
                                                                  ('Jane Smith', 'jane.smith@email.com', '2023-02-20', 'Basic'),
                                                                  ('Mike Johnson', 'mike.johnson@email.com', '2023-03-10', 'VIP'),
                                                                  ('Emily Brown', 'emily.brown@email.com', '2023-04-05', 'Premium'),
                                                                  ('David Lee', 'david.lee@email.com', '2023-05-12', 'Basic');


INSERT INTO trainers (name, specialization, email) VALUES
                                                       ('Sarah Connor', 'Weightlifting', 'sarah.connor@gym.com'),
                                                       ('Tom Wilson', 'Yoga', 'tom.wilson@gym.com'),
                                                       ('Lisa Chen', 'Cardio', 'lisa.chen@gym.com'),
                                                       ('Alex Rodriguez', 'CrossFit', 'alex.rodriguez@gym.com'),
                                                       ('Emma Watson', 'Pilates', 'emma.watson@gym.com');

INSERT INTO classes (name, trainer_id, schedule, capacity) VALUES
                                                               ('Morning Yoga', 25, 'Monday, Wednesday, Friday 7:00 AM', 20),
                                                               ('HIIT Workout', 27, 'Tuesday, Thursday 6:00 PM', 15),
                                                               ('Weightlifting 101', 24, 'Monday, Friday 5:00 PM', 10),
                                                               ('Cardio Blast', 26, 'Wednesday, Saturday 10:00 AM', 25),
                                                               ('Pilates for Beginners', 28, 'Tuesday, Thursday 11:00 AM', 15);


INSERT INTO memberships (member_id, class_id, start_date, end_date) VALUES
                                                                        (26, 21, '2023-06-01', '2023-12-31'),
                                                                        (27, 22, '2023-06-15', '2023-12-31'),
                                                                        (28, 24, '2023-07-01', '2023-12-31'),
                                                                        (29, 28, '2023-07-15', '2023-12-31'),
                                                                        (30, 23, '2023-08-01', '2023-12-31');


INSERT INTO equipment (name, quantity, last_maintenance_date) VALUES
                                                                  ('Treadmill', 10, '2023-05-15'),
                                                                  ('Dumbbell Set', 5, '2023-06-01'),
                                                                  ('Yoga Mat', 30, '2023-06-15'),
                                                                  ('Stationary Bike', 8, '2023-05-20'),
                                                                  ('Rowing Machine', 4, '2023-06-10');



CREATE OR REPLACE FUNCTION is_membership_active(member_id INTEGER)
    RETURNS BOOLEAN AS $$
DECLARE
    active BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM memberships
        WHERE memberships.member_id = member_id
          AND memberships.end_date >= CURRENT_DATE
    ) INTO active;
    RETURN active;
END;
$$ LANGUAGE plpgsql;



-- trigger to ensure class capacity is not exceeded
CREATE OR REPLACE FUNCTION check_class_capacity()
RETURNS TRIGGER AS $$
DECLARE
current_capacity INTEGER;
BEGIN
SELECT COUNT(*) INTO current_capacity
FROM memberships
WHERE class_id = NEW.class_id AND end_date >= CURRENT_DATE;

IF current_capacity >= (SELECT capacity FROM classes WHERE id = NEW.class_id) THEN
        RAISE EXCEPTION 'Class capacity exceeded';
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_class_capacity
    BEFORE INSERT ON memberships
    FOR EACH ROW
    EXECUTE FUNCTION check_class_capacity();


-- trigger to prevent overbooking of classes
CREATE OR REPLACE FUNCTION prevent_class_overbooking()
    RETURNS TRIGGER AS $$
DECLARE
    current_enrollment INTEGER;
    class_capacity INTEGER;
BEGIN
    SELECT COUNT(*), classes.capacity
    INTO current_enrollment, class_capacity
    FROM memberships
             JOIN classes ON memberships.class_id = classes.id
    WHERE memberships.class_id = NEW.class_id
    GROUP BY classes.capacity;

    IF current_enrollment >= class_capacity THEN
        RAISE EXCEPTION 'Class is at full capacity. Cannot enroll more members.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_class_capacity
    BEFORE INSERT ON memberships
    FOR EACH ROW EXECUTE FUNCTION prevent_class_overbooking();

-- trigger to automatically update membership type based on join date
CREATE OR REPLACE FUNCTION update_membership_type()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.join_date <= CURRENT_DATE - INTERVAL '1 year' THEN
        NEW.membership_type = 'Gold';
    ELSIF NEW.join_date <= CURRENT_DATE - INTERVAL '6 months' THEN
        NEW.membership_type = 'Silver';
    ELSE
        NEW.membership_type = 'Bronze';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_membership
    BEFORE INSERT OR UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_membership_type();


-- trigger to ensure trainer specialization is not empty
CREATE OR REPLACE FUNCTION validate_trainer_specialization()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.specialization IS NULL OR NEW.specialization = '' THEN
        RAISE EXCEPTION 'Trainer specialization cannot be empty';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_trainer_specialization
    BEFORE INSERT OR UPDATE ON trainers
    FOR EACH ROW EXECUTE FUNCTION validate_trainer_specialization();

-- trigger to update class schedule when trainer's availability changes
CREATE OR REPLACE FUNCTION update_class_schedule()
    RETURNS TRIGGER AS $$
BEGIN
    IF OLD.availability <> NEW.availability THEN
        UPDATE classes
        SET schedule = NEW.availability
        WHERE trainer_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_trainer_class_schedule
    AFTER UPDATE ON trainers
    FOR EACH ROW EXECUTE FUNCTION update_class_schedule();