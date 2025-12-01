'use client';

import * as React from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TwitterShareButton,
} from 'react-share';
import { Box, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Icon } from '../../cartridges/DesignSystem';

export type TShareMenu = {
  frontmatter?: any;
  [key: string]: any;
};

export default function ShareMenu({ frontmatter = null }: TShareMenu) {
  const [copied, setCopied] = React.useState(false);
  const { title, description, icon } = frontmatter;
  const fullWidth = { display: 'block' };
  const url = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <MenuItem
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1500);
        }}
      >
        <ListItemIcon>
          <Icon icon="copy" color="secondary" />
        </ListItemIcon>
        <ListItemText primary={copied ? 'Copied!' : 'Copy Link'} />
      </MenuItem>

      <MenuItem sx={{ p: 0 }}>
        <FacebookShareButton url={url} style={fullWidth}>
          <Box display="flex" alignItems="center" px={2} py={1}>
            <ListItemIcon>
              <Icon icon="facebook" color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Facebook" />
          </Box>
        </FacebookShareButton>
      </MenuItem>

      <MenuItem sx={{ p: 0 }}>
        <TwitterShareButton title={title} url={url}>
          <Box display="flex" alignItems="center" px={2} py={1}>
            <ListItemIcon>
              <Icon icon="twitter" color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Twitter (X)" />
          </Box>
        </TwitterShareButton>
      </MenuItem>

      <MenuItem sx={{ p: 0 }}>
        <LinkedinShareButton
          url={url}
          title={title}
          summary={description}
          source="Goldlabel"
          style={fullWidth}
        >
          <Box display="flex" alignItems="center" px={2} py={1}>
            <ListItemIcon>
              <Icon icon="linkedin" color="secondary" />
            </ListItemIcon>
            <ListItemText primary="LinkedIn" />
          </Box>
        </LinkedinShareButton>
      </MenuItem>

      <MenuItem sx={{ p: 0 }}>
        <WhatsappShareButton
          url={url}
          title={title}
          separator=" - "
          style={fullWidth}
        >
          <Box display="flex" alignItems="center" px={2} py={1}>
            <ListItemIcon>
              <Icon icon="whatsapp" color="secondary" />
            </ListItemIcon>
            <ListItemText primary="WhatsApp" />
          </Box>
        </WhatsappShareButton>
      </MenuItem>
    </>
  );
}
