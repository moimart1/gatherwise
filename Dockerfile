FROM node:lts-alpine as base

ENV NODE_ENV production
ENV PORT 3000
ENV HOME /app

# Create and set working directory with non privileged user
RUN mkdir -p $HOME && addgroup user && adduser -D -G user user && chown user:user /app
WORKDIR $HOME

COPY --chown=user:user package.json .

# Dependencies part #
FROM base as runtime-dependencies

# install and copy production node_modules aside
RUN npm set progress=false && npm config set depth 0 && \
    npm install --production

# Development part #
FROM runtime-dependencies as dev

# install dev dependencies and use prod cache
ENV NODE_ENV development
RUN npm install

# Set dev env to $USER, avoid permission denied when run test
ARG USER_UID=user

COPY --chown=$USER_UID:$USER_UID . $HOME

RUN npm run build && \
    chown -R $USER_UID:$USER_UID $HOME/dist $HOME/.npm
USER ${USER_UID}

# Production part #
FROM base as prod

COPY --from=runtime-dependencies --chown=user:user $HOME/node_modules $HOME/node_modules
COPY --from=dev --chown=user:user $HOME/dist $HOME/dist

USER user
EXPOSE $PORT

# Start app command
CMD node .

# Saved args for production
ARG APP_COMMIT_HASH
ENV APP_COMMIT_HASH=${APP_COMMIT_HASH}
ARG APP_BRANCH_NAME
ENV APP_BRANCH_NAME=${APP_BRANCH_NAME}
ARG APP_DEVELOPMENT_STAGE
ENV APP_DEVELOPMENT_STAGE=${APP_DEVELOPMENT_STAGE}
ARG APP_BUILD_DATE
ENV APP_BUILD_DATE=${APP_BUILD_DATE}
ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION}
ARG APP_FULLVERSION
ENV APP_FULLVERSION=${APP_FULLVERSION}
