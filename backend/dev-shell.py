#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function


import logging
from argparse import ArgumentParser

import IPython
from traitlets.config.loader import Config
from IPython.terminal.prompts import Prompts, Token
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from mr.core import Core
from mr.core.coreconf import CoreConf


_readme = """
"""
_readme = _readme.strip()

logging.basicConfig(level=logging.INFO, format='%(asctime)s:%(levelname)s:%(name)s:%(message)s')
log = logging.getLogger('dev-shell')


class MRPrompt(Prompts):

    """Docstring for MRPrompt. """
    def in_prompt_tokens(self, cli=None):
        return [
            (Token.Prompt, 'ba ['),
            (Token.PromptNum, '{:>3}'.format(str(self.shell.execution_count))),
            (Token.Prompt, '] '),
        ]


def get_conf():
    parser = ArgumentParser(description='', usage=_readme)
    parser.add_argument('--db', default='postgresql+psycopg2://postgres:postconnectuser@127.0.0.1/reporting')
    return parser.parse_args()


def main():
    conf = get_conf()

    engine = create_engine(conf.db, poolclass=NullPool, echo=True)
    Session = sessionmaker(bind=engine)
    s = Session()
    core_conf = CoreConf()
    core = Core(s, core_conf)

    ip_cfg = Config()
    ip_cfg.TerminalInteractiveShell.prompts_class = MRPrompt
    ip_cfg.InteractiveShell.confirm_exit = False
    IPython.embed(config=ip_cfg, banner1='\nManagement Reporting dev-shell\n\n')


if __name__ == '__main__':
    main()
