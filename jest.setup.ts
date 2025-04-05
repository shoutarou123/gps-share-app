import "@testing-library/jest-dom";
import { TextEncoder } from 'node:util'

require("dotenv").config();

global.TextEncoder = TextEncoder;
