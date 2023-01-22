#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";

import { NextAuthStack } from "./NextAuthStack";

const app = new App();

new NextAuthStack(app, "NextAuthStack");
