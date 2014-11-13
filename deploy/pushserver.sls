nodejs-deps:
  pkg.installed:
    - names:
      - g++
      - curl
      - libssl-dev
      - apache2-utils
  require:
    - pkg: git

nodejs-source:
  git.latest:
    - target: /usr/src/nodejs
    - name: git://github.com/joyent/node.git
    - rev: v0.10.32-release

nodejs-install:
  cmd.run:
    - cwd: /usr/src/nodejs
    - name: ./configure && make && make install
    - onlyif: if [ -z $(node --version) ] || [ $(node --version) != "v0.10.32" ]; then echo "should update"; else exit 1; fi;
    - require:
      - git: nodejs-source
      - pkg: nodejs-deps
