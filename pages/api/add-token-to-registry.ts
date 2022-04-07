import type { NextApiRequest, NextApiResponse } from "next/types";
import tokenListJson from "../../solana-token-list/src/tokens/solana.tokenlist.json";
import fs from "fs";
import git, { SimpleGit, SimpleGitOptions } from "simple-git";
import simpleGit from "simple-git";
import { Octokit } from "@octokit/rest";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const octokit = new Octokit({
      auth: process.env.GITHUB_AUTH_STRING,
    });
    const options: Partial<SimpleGitOptions> = {
      baseDir: `solana-token-list`,
      binary: "git",
      maxConcurrentProcesses: 6,
    };
    const git: SimpleGit = simpleGit(options);
    const repoFork = await octokit.rest.repos.createFork({
      owner: "solana-labs",
      repo: "token-list",
    });
    const {
      data: {
        owner: { login: forkOwnerLogin },
        name: forkName,
      },
    } = repoFork;
    await git.pull("origin", "main", {});
    const usersRemote = `${forkOwnerLogin}/${forkName}`;
    const remoteAlreadyExist = (await git.getRemotes()).filter(
      (remote) => remote.name !== usersRemote,
    );
    if (!remoteAlreadyExist)
      await git.addRemote(usersRemote, repoFork.data.clone_url);

    const tokenList = tokenListJson;
    const { tokens } = tokenList;
    const newToken = req.body;
    const tokenLength = tokens.length;
    const newTokens = [...tokens];
    //make it so that the new token is added second to last of the list
    newTokens.splice(tokenLength - 2, 0, newToken);
    tokenList.tokens = newTokens;

    const newBranch = `add_to_registry_${newToken.symbol}_${newToken.address}`;
    await git.checkoutBranch(newBranch, "origin/main");
    fs.writeFileSync(
      "solana-token-list/src/tokens/solana.tokenlist.json",
      JSON.stringify(tokenList, null, 2),
      "utf8",
    );

    git
      .add(["src/tokens/solana.tokenlist.json"])
      .commit(`added token to registry ${newToken.symbol}`)
      .push(usersRemote, newBranch)
      .then(() => {
        octokit.rest.pulls.create({
          owner: "solana-labs",
          repo: "token-list",
          head: `${forkOwnerLogin}:${newBranch}`,
          base: "main",
          title: `Add token to registry ${newToken.symbol}`,
        });
      });
    await git.checkoutBranch("main", "origin/main");

    res.status(200).json("success");
  } else {
    // Handle any other HTTP method
  }
};
