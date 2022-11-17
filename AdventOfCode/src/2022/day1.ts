import { Glib } from '../../../Glib/Glib'
import { Filer } from '../../../Glib/built/Filer'

Glib.init();



Filer.ReadAllLines('../../input.txt').Log();

('asdf').toInt();
('asdf').Log();

(false).Log()